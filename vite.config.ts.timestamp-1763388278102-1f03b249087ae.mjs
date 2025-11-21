// vite.config.ts
import { defineConfig } from "file:///C:/Users/mathe/OneDrive/Desktop/Lovable%20carte%20france/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/mathe/OneDrive/Desktop/Lovable%20carte%20france/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/mathe/OneDrive/Desktop/Lovable%20carte%20france/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\mathe\\OneDrive\\Desktop\\Lovable carte france";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: true,
    proxy: {
      // API Signatures (dev) -> Express local
      "/api": {
        // Utilise une variable d'env si présente (Docker), sinon 127.0.0.1 (évite ::1)
        target: process.env.VITE_PROXY_API_TARGET || "http://127.0.0.1:5174",
        changeOrigin: true,
        secure: false
      },
      // Proxy de dev pour contourner le CORS sur le flux Hellowork
      "/proxy/hellowork": {
        target: "https://master.nicoka.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path2) => path2.replace(/^\/proxy\/hellowork/, "/jobboards/hellowork")
      },
      // Proxy de dev pour le flux Directemploi
      "/proxy/directemploi": {
        target: "https://master.nicoka.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path2) => path2.replace(/^\/proxy\/directemploi/, "/jobboards/directemploi")
      },
      // Proxy de dev pour le flux Meteojob
      "/proxy/meteojob": {
        target: "https://master.nicoka.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path2) => path2.replace(/^\/proxy\/meteojob/, "/jobboards/meteojob")
      },
      // Proxy de dev pour le flux Indeed
      "/proxy/indeed": {
        target: "https://master.nicoka.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path2) => path2.replace(/^\/proxy\/indeed/, "/jobboards/indeed")
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYXRoZVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXExvdmFibGUgY2FydGUgZnJhbmNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYXRoZVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXExvdmFibGUgY2FydGUgZnJhbmNlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9tYXRoZS9PbmVEcml2ZS9EZXNrdG9wL0xvdmFibGUlMjBjYXJ0ZSUyMGZyYW5jZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgcG9ydDogNTE3MyxcbiAgICBvcGVuOiB0cnVlLFxuICAgIHByb3h5OiB7XG4gICAgICAvLyBBUEkgU2lnbmF0dXJlcyAoZGV2KSAtPiBFeHByZXNzIGxvY2FsXG4gICAgICBcIi9hcGlcIjoge1xuICAgICAgICAvLyBVdGlsaXNlIHVuZSB2YXJpYWJsZSBkJ2VudiBzaSBwclx1MDBFOXNlbnRlIChEb2NrZXIpLCBzaW5vbiAxMjcuMC4wLjEgKFx1MDBFOXZpdGUgOjoxKVxuICAgICAgICB0YXJnZXQ6IHByb2Nlc3MuZW52LlZJVEVfUFJPWFlfQVBJX1RBUkdFVCB8fCBcImh0dHA6Ly8xMjcuMC4wLjE6NTE3NFwiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogZmFsc2VcbiAgICAgIH0sXG4gICAgICAvLyBQcm94eSBkZSBkZXYgcG91ciBjb250b3VybmVyIGxlIENPUlMgc3VyIGxlIGZsdXggSGVsbG93b3JrXG4gICAgICBcIi9wcm94eS9oZWxsb3dvcmtcIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9tYXN0ZXIubmljb2thLmNvbVwiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3Byb3h5XFwvaGVsbG93b3JrLywgXCIvam9iYm9hcmRzL2hlbGxvd29ya1wiKSxcbiAgICAgIH0sXG4gICAgICAvLyBQcm94eSBkZSBkZXYgcG91ciBsZSBmbHV4IERpcmVjdGVtcGxvaVxuICAgICAgXCIvcHJveHkvZGlyZWN0ZW1wbG9pXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vbWFzdGVyLm5pY29rYS5jb21cIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9wcm94eVxcL2RpcmVjdGVtcGxvaS8sIFwiL2pvYmJvYXJkcy9kaXJlY3RlbXBsb2lcIiksXG4gICAgICB9LFxuICAgICAgLy8gUHJveHkgZGUgZGV2IHBvdXIgbGUgZmx1eCBNZXRlb2pvYlxuICAgICAgXCIvcHJveHkvbWV0ZW9qb2JcIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9tYXN0ZXIubmljb2thLmNvbVwiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3Byb3h5XFwvbWV0ZW9qb2IvLCBcIi9qb2Jib2FyZHMvbWV0ZW9qb2JcIiksXG4gICAgICB9LFxuICAgICAgLy8gUHJveHkgZGUgZGV2IHBvdXIgbGUgZmx1eCBJbmRlZWRcbiAgICAgIFwiL3Byb3h5L2luZGVlZFwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwczovL21hc3Rlci5uaWNva2EuY29tXCIsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvcHJveHlcXC9pbmRlZWQvLCBcIi9qb2Jib2FyZHMvaW5kZWVkXCIpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbcmVhY3QoKSwgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGNvbXBvbmVudFRhZ2dlcigpXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFYsU0FBUyxvQkFBb0I7QUFDM1gsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLE1BRUwsUUFBUTtBQUFBO0FBQUEsUUFFTixRQUFRLFFBQVEsSUFBSSx5QkFBeUI7QUFBQSxRQUM3QyxjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBO0FBQUEsTUFFQSxvQkFBb0I7QUFBQSxRQUNsQixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSx1QkFBdUIsc0JBQXNCO0FBQUEsTUFDL0U7QUFBQTtBQUFBLE1BRUEsdUJBQXVCO0FBQUEsUUFDckIsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsMEJBQTBCLHlCQUF5QjtBQUFBLE1BQ3JGO0FBQUE7QUFBQSxNQUVBLG1CQUFtQjtBQUFBLFFBQ2pCLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLHNCQUFzQixxQkFBcUI7QUFBQSxNQUM3RTtBQUFBO0FBQUEsTUFFQSxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLG9CQUFvQixtQkFBbUI7QUFBQSxNQUN6RTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
