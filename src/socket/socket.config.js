import { io } from "socket.io-client";
import { API_URL } from "../api/API_URL";

const socketChat = io(API_URL);

module.exports = socketChat