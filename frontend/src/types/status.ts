type StatusTransaltion = {
    [ key in string ]: string
}

export const StatusTranslation: StatusTransaltion = {
    ACTIVE: "Activo",
    INACTIVE: "Inactivo",
    DISABLED: "Desabilitado",
    BLOCKED: "Bloqueado",
    DELETED: "Eliminado",
    BANNED: "Baneado",
    DRAFT: "Borrador",
    PENDING: "Pendiente",
    READ: "Leído",
    UNREAD: "No leído",
    REVSION: "Revisión",
    SUSPENDED: "Suspendido",
    REJECTED: "Rechazado",
    PROCESSING: "Procesando",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
    CLOSED: "Cerrado",
    APPROVED: "Aprobado",
}

export const getStatusTranslation = (status: string) => {

    const st = StatusTranslation[ status ] || status;
    return st;
}