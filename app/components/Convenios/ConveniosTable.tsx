import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DataGrid,
  GridPagination,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { Box, Button, Chip, Toolbar } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import { getData } from "~/utils/apiUtils";
import { RowMenu } from "../../common/RowMenu/RowMenu";
import { useAuthContext } from "~/context/AuthContext";
import "./styles/ConveniosTable.css";
export interface Convenio {
    id_Convenio: number;
    numero_Convenio: string;
    tipo_Convenio: 'Empresa' | 'Dependencia' | 'Persona Física';
    estado: 'Incompleto' | 'Completo' | 'En Revisión' | 'En Corrección' | 'Revisado' | 'En Validación' | 'Requiere Ajuste'| 'Validado' | 'Cancelado';
    fecha_Inicio: string;
    documentos: number;
    unidad: string;
    nombre_Organizacion: string;
}
interface ConveniosTableProps {
  query: string;
  setModo: (modo: string) => void;
  setSelecccion: (seleccion: Convenio) => void;
}

const ROLE_COLORS = {
    'Persona Física': "info",
    'Empresa': "warning",
    'Dependencia': "secondary",
} as const;

const STATUS_COLORS = {
    'Incompleto': "warning",
    'Completo': "info",
    'En Revisión': "info",
    'En Corrección': "warning",
    'Revisado': "info",
    'En Validación': "info",
    'Requiere Ajuste': "warning",
    'Validado': "success",
    'Cancelado': "error",
} as const;

const normalizeText = (text: string) =>
    (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .toLowerCase()
    .trim();

export default function ConveniosTable({ query, setModo, setSelecccion }: ConveniosTableProps) {
    const { user } = useAuthContext();
    const [rows, setRows] = useState<Convenio[]>([]);
    const [filteredRows, setFilteredRows] = useState<Convenio[]>([]);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
    const [rowCount, setRowCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchConvenios = async () => {
            setLoading(true);
            const res = await getData({
                endpoint: "/convenios",
                query: `?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`,
            });

            const data = res.data?.data || [];
            const total = res.data?.total || 0;

            setRows(data);
            setFilteredRows(data);
            setRowCount(total);
            setLoading(false);
        };
        fetchConvenios();
    }, [paginationModel]);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredRows(rows);
            return;
        }

        const normalizedQuery = normalizeText(query);
        const terms = normalizedQuery.split(/\s+/).filter(Boolean);
        
        const SEARCH_FIELDS: Array<keyof Convenio> = [
            'numero_Convenio',
            'tipo_Convenio',
            'estado',
            'unidad',
            'nombre_Organizacion',
        ];

        const filtered = rows.filter((row) => {
            const rowText = SEARCH_FIELDS.map(field => normalizeText(row[field] as string)).join(" ");
            
            return terms.every(term => rowText.includes(term));
        });
        
        setFilteredRows(filtered);
    }, [query, rows]);

    const handleEditar = useCallback((row: Convenio) => {
        setModo("editar");
        setSelecccion(row);
    }, [setModo, setSelecccion]);
    
    const handleVer = useCallback((row: Convenio) => { /* Lógica para ver */ }, []);
    const handleEnviarRevision = useCallback(async (row: Convenio) => { /* Lógica */ }, []);
    const handleEnviarValidar = useCallback(async (row: Convenio) => { /* Lógica */ }, []);
    const handleCancelar = useCallback(async (row: Convenio) => { /* Lógica */ }, []);


    const getRoleColor = (rol: string) => 
        ROLE_COLORS[rol as keyof typeof ROLE_COLORS] || "default";
    
    const getStatusColor = (estado: string) => 
        STATUS_COLORS[estado as keyof typeof STATUS_COLORS] || "default";

    const getActionFunctions = useCallback((row: Convenio) => {
        const estadoActual = row.estado;
        let actions: { ver?: typeof handleVer, editar?: typeof handleEditar, enviarRevision?: typeof handleEnviarRevision, enviarValidar?: typeof handleEnviarValidar, cancelar?: typeof handleCancelar } = {};
        
        if (user) {
            actions.ver = handleVer;
        }

        const { rol } = user ?? {};

        const ALLOWED_ACTIONS: Record<string, { edit: string[], cancel: string[], rev: string[], val: string[] }> = {
            Organizacion: {
                edit: ["Incompleto", "En Corrección"],
                cancel: ["Incompleto", "Completo", "En Corrección"],
                rev: ["Completo", "En Corrección"],
                val: [],
            },
            Gestor: {
                edit: ["Incompleto", "En Corrección"],
                cancel: ["Incompleto", "Completo"],
                rev: ["Completo", "En Corrección"],
                val: [],
            },
            Revisor: {
                edit: ["Incompleto", "Completo", "Requiere Ajuste", "Revisado"],
                cancel: ["Incompleto", "Completo", "En Corrección", "Requiere Ajuste", "Revisado"],
                rev: [],
                val: ["Revisado"],
            },
            Coordinador: {
                edit: ["Incompleto", "Completo", "En Corrección", "Requiere Ajuste"],
                cancel: ["Incompleto", "Completo", "En Revisión", "En Corrección", "Requiere Ajuste", "En Validación"],
                rev: ["Completo", "En Corrección"],
                val: ["Revisado", "Requiere Ajuste"],
            },
        };

        const allowed = ALLOWED_ACTIONS[rol as keyof typeof ALLOWED_ACTIONS];
        
        if (allowed) {
            if (allowed.edit.includes(estadoActual)) actions.editar = handleEditar;
            if (allowed.cancel.includes(estadoActual)) actions.cancelar = handleCancelar;
            if (allowed.rev.includes(estadoActual)) actions.enviarRevision = handleEnviarRevision;
            if (allowed.val.includes(estadoActual)) actions.enviarValidar = handleEnviarValidar;
        }
        
        if (rol === "Revisor" && ["En Validación", "Validado", "Cancelado"].includes(estadoActual)) {
             actions.editar = undefined;
             actions.cancelar = undefined;
        }
        if (rol === "Coordinador" && ["Revisado", "Validado", "Cancelado"].includes(estadoActual)) {
             actions.editar = undefined;
             actions.cancelar = undefined;
        }
        
        return actions;
    }, [user, handleVer, handleEditar, handleCancelar, handleEnviarRevision, handleEnviarValidar]);

    const columns: GridColDef<Convenio>[] = useMemo(
        () => [
            { field: "numero_Convenio", headerName: "CONVENIO", flex: 1.3, minWidth: 100 },
            { field: "nombre_Organizacion", headerName: "NOMBRE O RAZÓN SOCIAL", flex: 1.5, minWidth: 250 },
            {
                field: "tipo_Convenio",
                headerName: "TIPO DE CONVENIO",
                flex: 0.8,
                minWidth: 160,
                renderCell: (params) => (
                    <Chip
                        label={params.value}
                        color={getRoleColor(params.value)}
                        variant="filled"
                        size="small"
                        className="chip-role"
                    />
                ),
            },
            { field: "unidad", headerName: "UNIDAD ACADÉMICA", flex: 1, minWidth: 160 },
            { field: "fecha_Inicio", headerName: "FECHA INICIO", flex: 1, minWidth: 160 },
            {
                field: "estado",
                headerName: "ESTADO",
                flex: 0.7,
                minWidth: 120,
                renderCell: (params) => (
                    <Chip
                        label={params.value}
                        color={getStatusColor(params.value)}
                        variant="filled"
                        size="small"
                        className="chip-status"
                    />
                ),
            },
            {
                field: "documentos",
                headerName: "DOCUMENTOS",
                flex: 1,
                minWidth: 160,
                renderCell: (params) => {
                    const count = Number(params.value) || 0;
                    const Icon = count >= 1 ? FolderIcon : DescriptionIcon;
                    return (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Icon fontSize="small" sx={{ color: "#333" }} />
                            <Box component="span" sx={{ fontSize: 13, color: "#333" }}>{count}</Box>
                        </Box>
                    );
                },
            },
            {
                field: "acciones",
                headerName: "ACCIONES",
                flex: 0.4,
                minWidth: 100,
                sortable: false,
                renderCell: (params) => {
                    const actions = getActionFunctions(params.row);
                    return (
                        <RowMenu<Convenio>
                            row={params.row}
                            estado={params.row.estado}
                            onVer={actions.ver}
                            onEditar={actions.editar}
                            onEnviarRevision={actions.enviarRevision}
                            onEnviarValidar={actions.enviarValidar}
                            onCancelar={actions.cancelar}
                        />
                    );
                },
            },
        ],
        [getActionFunctions]
    );

    const exportToCSV = () => {
        if (!filteredRows || filteredRows.length === 0) return;

        const exportCols = columns.filter((c) => c.field !== "acciones");
        const headers = exportCols.map((c) => c.headerName ?? c.field);

        const escapeCell = (value: unknown) => {
            if (value == null) return "";
            let s = typeof value === "string" ? value : String(value);
            s = s.replace(/\r?\n/g, " ").replace(/"/g, '""');
            return `"${s}"`;
        };

        const rowsCsv = filteredRows.map((row) =>
            exportCols.map((col) => escapeCell((row as any)[col.field])).join(",")
        );

        const csvContent = [headers.map(escapeCell).join(","), ...rowsCsv].join("\r\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
        a.href = url;
        a.download = `convenios_export_${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const CustomFooter = () => (
        <Toolbar className="footer-toolbar">
            <Box className="export-section-inline">
                <Button
                    startIcon={<DownloadIcon fontSize="small" />}
                    variant="text"
                    sx={{ textTransform: "none", color: "#333", fontWeight: 500 }}
                    onClick={exportToCSV}
                >
                    Exportar Excel
                </Button>
            </Box>
            <GridPagination />
        </Toolbar>
    );

    return (
        <Box className="convenios-table-container">
            <DataGrid
                className="convenios-table"
                disableColumnMenu
                rows={filteredRows}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id_Convenio}
                paginationMode="server"
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 20]}
                slots={{ footer: CustomFooter }}
                sx={{ border: "none", "& .MuiDataGrid-columnHeaders": { fontWeight: 600 } }}
            />
        </Box>
    );
}