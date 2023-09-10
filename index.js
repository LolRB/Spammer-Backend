import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(cors());

// tell express we are going to use json
app.use(express.json());

// recursive function
// async function getMessagesWithChildren(messageId) {
//   const messages = await prisma.message.findMany({
//     select: {
//       id: true,
//       createdAt: true,
//       text: true,
//       parentId: true,
//       likes: true,
//       children: {
//         select: {
//           id: true,
//           createdAt: true,
//           text: true,
//           parentId: true,
//           likes: true,
//           children: {
//             select: {
//               id: true,
//               createdAt: true,
//               text: true,
//               parentId: true,
//               likes: true,
//               // Continue nesting if necessary for deeper levels of children
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!message) {
//     return null; // Stop the recursion when no message is found
//   }
//     // Recursively call the function for nested child messages
//     const children = await Promise.all(
//     message.children.map(async (child) => {
//     return await getMessagesWithChildren(child.id);
//     })
//     );

//     return (
//     ...message,
//     children,
//     );
// }

app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to Spammer Backend" });
});

// GET /messages to return all messages
app.get("/messages", async (req, res) => {
  // get the actual message from the db
  const messages = await prisma.message.findMany();
  res.send({ success: true, messages });
});

// // GET request handler
// app.get("/messages", async (req, res) => {
//   const messages = await prisma.message.findMany({
//     select: {
//       id: true,
//       createdAt: true,
//       text: true,
//       parentId: true,
//       likes: true,
//       children: true,
//     },
//   });
//   const data = {
//     success: true,
//     messages,
//   };
//   res.json({ data });
// });

// GET /messages/:messageId to return one message
app.get("/messages/:messageId/", async (req, res) => {
  const { messageId } = req.params;
  const message = await prisma.message.findFirst({
    where: { id: messageId },
  });
  if (!message) {
    return res.send({
      success: false,
      error: "Message with that Id not found.",
    });
  }
  res.send({
    success: true,
    message,
  });
});

// PUT I want to update a message's text or likes
app.put("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { text, likes } = req.body;

  try {
    if (!text && !likes) {
      return res.send({
        success: false,
        error: "Text or Likes wasn't included in your update request.",
      });
    }
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { text, likes },
    });
    res.send({
      success: true,
      message,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// POST a new message
app.post("/messages", async (req, res) => {
  const { text } = req.body;
  try {
    if (!text) {
      return res.send({
        success: false,
        error: "Text must be provided to create a message!",
      });
    }

    const message = await prisma.message.create({
      data: {
        text,
      },
    });

    res.send({ success: true, message });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

// Delete a message
app.delete("/messages/:messageId", async (req, res) => {
  const { messageId } = req.params;

  try {
    const deletedMessage = await prisma.message.delete({
      where: { id: messageId },
    });
    res.send({
      success: true,
      deletedMessage,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Error messages
app.use((error, req, res, next) => {
  res.send({
    success: false,
    errror: error.message,
  });
});

app.use((req, res) => {
  res.send({
    success: false,
    errror: "No route found.",
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
