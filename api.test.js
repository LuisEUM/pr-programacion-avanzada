import fetch from "node-fetch";

// API Test Suite
const API_URL = "http://localhost:3000"; // URL del backend API
let authToken = "";

// Función auxiliar para hacer peticiones
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  console.log(`Making request to: ${url}`);

  const headers = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error in request to ${url}:`, error.message);
    throw error;
  }
}

// 1. Prueba de Login
async function testLogin() {
  console.log("Testing Login...");
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "johndoe",
        password: "a1b2c3d4",
      }),
    });

    if (response.ok) {
      authToken = response.headers.get("Authorization").split(" ")[1];
      console.log("✅ Login successful");
    } else {
      console.error("❌ Login failed");
    }
  } catch (error) {
    console.error("❌ Login error:", error);
  }
}

// 2. Prueba de Usuarios
async function testUsers() {
  console.log("\nTesting User Endpoints...");
  try {
    // GET /user/:username
    const userData = await fetchAPI("/user/testuser");
    console.log("✅ Get user data successful:", userData);

    // GET /user/:username/posts
    const userPosts = await fetchAPI("/user/testuser/posts?limit=10&offset=0");
    console.log("✅ Get user posts successful:", userPosts);
  } catch (error) {
    console.error("❌ User endpoints error:", error);
  }
}

// 3. Prueba de Posts
async function testPosts() {
  console.log("\nTesting Post Endpoints...");
  try {
    // GET /posts
    const allPosts = await fetchAPI("/posts?limit=10&offset=0");
    console.log("✅ Get all posts successful:", allPosts);

    // POST /posts
    const newPost = await fetchAPI("/posts", {
      method: "POST",
      body: JSON.stringify({ content: "Test post content" }),
    });
    console.log("✅ Create post successful:", newPost);

    // GET /posts/:id
    const postDetail = await fetchAPI(`/posts/${newPost.id}`);
    console.log("✅ Get post detail successful:", postDetail);

    // PUT /posts/:id
    const updatedPost = await fetchAPI(`/posts/${newPost.id}`, {
      method: "PUT",
      body: JSON.stringify({ content: "Updated test post content" }),
    });
    console.log("✅ Update post successful:", updatedPost);

    // DELETE /posts/:id
    await fetchAPI(`/posts/${newPost.id}`, {
      method: "DELETE",
    });
    console.log("✅ Delete post successful");
  } catch (error) {
    console.error("❌ Post endpoints error:", error);
  }
}

// 4. Prueba de Respuestas
async function testReplies() {
  console.log("\nTesting Reply Endpoints...");
  try {
    // Primero creamos un post para responder
    const newPost = await fetchAPI("/posts", {
      method: "POST",
      body: JSON.stringify({ content: "Post for reply test" }),
    });

    // POST /replies
    const reply = await fetchAPI("/replies", {
      method: "POST",
      body: JSON.stringify({
        postId: newPost.id,
        content: "Test reply content",
      }),
    });
    console.log("✅ Create reply successful:", reply);

    // Limpiamos el post de prueba
    await fetchAPI(`/posts/${newPost.id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("❌ Reply endpoints error:", error);
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log("Starting API Tests...\n");

  await testLogin();
  if (authToken) {
    await testUsers();
    await testPosts();
    await testReplies();
  }

  console.log("\nAPI Tests completed!");
}

// Ejecutar las pruebas
runAllTests();
