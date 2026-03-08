import { createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./routes/ProtectedRoute";


const router = createBrowserRouter([
    {path:'/', element: 
        <ProtectedRoute>
            <ChatPage />
        </ProtectedRoute>
    },
    {path:'/login', element:<Login />},
    {path:'/signup', element:<Signup />},
    {path:'/*', element:<NotFound />},
])

export default router