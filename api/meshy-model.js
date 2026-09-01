export default async function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    // Get the Meshy model URL
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "Missing model URL",
      });
    }

    // Decode the URL
    const modelUrl = Array.isArray(url)
      ? url[0]
      : url;

    // Basic security check:
    // Only allow Meshy asset URLs
    let parsedUrl;

    try {
      parsedUrl = new URL(modelUrl);
    } catch {
      return res.status(400).json({
        error: "Invalid model URL",
      });
    }

    if (
      parsedUrl.hostname !== "assets.meshy.ai" &&
      !parsedUrl.hostname.endsWith(".meshy.ai")
    ) {
      return res.status(403).json({
        error: "Only Meshy asset URLs are allowed",
      });
    }

    console.log("Fetching Meshy model:");
    console.log(modelUrl);

    // Fetch the GLB from Meshy
    const response = await fetch(modelUrl, {
      method: "GET",
      headers: {
        Accept:
          "model/gltf-binary, application/octet-stream, */*",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Meshy returned error:",
        response.status,
        errorText
      );

      return res.status(response.status).json({
        error: "Meshy model download failed",
        status: response.status,
        details: errorText,
      });
    }

    // Get the binary GLB data
    const arrayBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    // Tell browser this is a GLB file
    res.setHeader(
      "Content-Type",
      "model/gltf-binary"
    );

    res.setHeader(
      "Content-Length",
      buffer.length.toString()
    );

    // Allow browser/Three.js to access it
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, OPTIONS"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "*"
    );

    // Prevent caching problems with signed Meshy URLs
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );

    // Send GLB to browser
    return res.status(200).send(buffer);

  } catch (error) {
    console.error(
      "Meshy proxy error:",
      error
    );

    return res.status(500).json({
      error: "Unable to proxy Meshy model",
      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
}