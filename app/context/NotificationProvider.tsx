import { type ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { NotificationContext } from "./NotificationContext";
import { getData } from "~/utils/apiUtils";
import { useAuthContext } from "./AuthContext";

interface Props {
    children: ReactNode;
}

export default function NotificationProvider({ children }: Props) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const { user } = useAuthContext();
    const url = import.meta.env.VITE_PUBLIC_URL;

    const addNotification = (notification: any) => {
        setNotifications((prev) => {
            const exists = prev.some(
                (n) => n.id_Notificacion === notification.id_Notificacion
            );
            return exists ? prev : [notification, ...prev];
        });
    };

    const clearNotifications = () => setNotifications([]);

    const getNotifications = async () => {
        if (!user?.id_Cuenta) return;

        try {
            const { statusCode, data } = await getData({
                endpoint: `/notificaciones/usuario/${user.id_Cuenta}?entregado=0`,
            });

            if (statusCode === 200 && Array.isArray(data.data)) {
                const newData = data.data;

                setNotifications((prev) => {
                    const prevIds = new Set(prev.map((n) => n.id_Notificacion));
                    const newIds = new Set(newData.map((n: any) => n.id_Notificacion));
                    if (
                        prev.length === newData.length &&
                        [...prevIds].every((id) => newIds.has(id))
                    ) {
                        return prev;
                    }
                    return newData;
                });
            } else {
                console.warn("No se encontraron notificaciones válidas.");
            }
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
        }
    };

    useEffect(() => {
        if (!user?.id_Cuenta) return;

        getNotifications();

        const newSocket = io(url, { transports: ["websocket"] });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            newSocket.emit("join", `cuenta_${user?.id_Cuenta}`);
        });

        newSocket.on("disconnect", () => {
            console.log("Desconectado del servidor de notificaciones");
        });

        newSocket.on("nueva_notificacion", (data) => {
            addNotification(data);
        });

        const interval = setInterval(getNotifications, 1000);

        return () => {
            clearInterval(interval);
            newSocket.disconnect();
        };
    }, [user?.id_Cuenta]);

    return (
        <NotificationContext.Provider
            value={{
                socket,
                notifications,
                addNotification,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}
