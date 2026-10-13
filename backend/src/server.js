import app from "./app.js";

const PORT = Number(process.env.PORT || 5002);

const server = app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error(`Gagal menjalankan server di port ${PORT}:`, error.message);
  process.exitCode = 1;
});