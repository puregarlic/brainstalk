import { Handler } from "$fresh/server.ts";

type ClientEvent = {
  type: "POST";
  text: string;
} | {
  type: "DELETE";
  ids: string[];
};

type ServerEvent = {
  type: "DONE";
  event: ClientEvent;
} | {
  type: "NEW";
  atom: {
    id: string;
    text: string;
  };
};

export const handler: Handler = (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("request isn't trying to upgrade to websocket.");
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel("messages");

    channel.onmessage = (e: MessageEvent<ServerEvent>) => {
      if (e.data.type === "NEW") {
        socket.send(JSON.stringify(e.data));
      }
    };
  }

  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e: MessageEvent<ClientEvent>) => {
    console.log("socket message:", e.data);

    switch (e.data.type) {
      case "POST":
        // Save new atom
        break;
      case "DELETE":
        // Delete the specified atom(s)
        break;
    }

    socket.send(new Date().toString());
  };
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => console.log("socket closed");

  return response;
};
