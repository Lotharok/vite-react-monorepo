import { http } from "msw";

export const service2 = [
   http.post("/user", async ({ request }) => {
      // Read the request body as JSON.
      const user = await request.json();
      const { id } = user;
      return new Response(JSON.stringify({ id: id }), {
         headers: {
            "Content-Type": "application/json",
         },
      });
   }),
];
