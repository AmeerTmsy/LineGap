import { createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ChatProvider } from "./context/ChatContext";
import { AvailableProfileProvider } from "./context/AvailableProfileContext";


const router = createBrowserRouter([
    {
        path: '/', element:
            <ProtectedRoute>
                <ChatProvider>
                    <AvailableProfileProvider>
                        <ChatPage />
                    </AvailableProfileProvider>
                </ChatProvider>
            </ProtectedRoute>
    },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/*', element: <NotFound /> },
])

export default router