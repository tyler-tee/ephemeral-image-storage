// Define the environment interface
interface Env {
	IMAGES_KV: KVNamespace; // Binding for the KV namespace
  }
  
  export default {
	async fetch(request: Request, env: Env): Promise<Response> {
	  const url = new URL(request.url);
  
	  if (request.method === "POST" && url.pathname === "/upload") {
		return handleUpload(request, env);
	  }
  
	  if (request.method === "GET" && url.pathname.startsWith("/image/")) {
		return handleRetrieve(url, env);
	  }
  
	  return new Response("Not found", { status: 404 });
	},
  };
  
  /**
   * Handle image uploads
   */
  async function handleUpload(request: Request, env: Env): Promise<Response> {
	try {
	  const id = crypto.randomUUID(); // Generate a unique ID for the image
	  const imageData = await request.arrayBuffer(); // Read binary data from the request
	  const expirationTime = Math.floor(Date.now() / 1000) + 60; // Expire in 1 minute
  
	  // Store the image in the KV namespace
	  await env.IMAGES_KV.put(id, imageData, { expiration: expirationTime });
  
	  return new Response(
		JSON.stringify({
		  url: `/image/${id}`,
		  expires: expirationTime,
		}),
		{ headers: { "Content-Type": "application/json" } }
	  );
	} catch (error) {
	  console.error("Error during image upload:", error);
	  return new Response("Failed to upload image", { status: 500 });
	}
  }
  
  /**
   * Handle image retrieval
   */
  async function handleRetrieve(url: URL, env: Env): Promise<Response> {
	try {
	  const id = url.pathname.split("/image/")[1]; // Extract the image ID from the URL
	  const imageData = await env.IMAGES_KV.get(id, { type: "arrayBuffer" });
  
	  if (!imageData) {
		return new Response("Image not found or expired", { status: 404 });
	  }
  
	  return new Response(imageData, { headers: { "Content-Type": "image/png" } });
	} catch (error) {
	  console.error("Error during image retrieval:", error);
	  return new Response("Failed to retrieve image", { status: 500 });
	}
  }
  