import * as z from "zod/v4";

// Esquemas de salida estructurada. Sin restricciones numéricas ni de longitud:
// la API no las admite y el SDK las validaría en cliente (un 4 en vez de 3 tumbaría
// el informe entero). Los valores se recortan en código (ver generate.ts).

const Criterion = z.object({
  puntuacion: z.number().int().describe("0 no se cumple, 1 flojo, 2 correcto, 3 excelente"),
  lo_que_veo: z.string().describe("Lo que se ve en la foto sobre este criterio. Una o dos frases concretas."),
  como_mejorarlo: z.string().describe("Una acción concreta para subir un punto. Una o dos frases."),
});

const Priority = z.object({
  titulo: z.string().describe("Acción en imperativo, máximo 8 palabras"),
  por_que: z.string().describe("Qué gana la tienda con ello, una frase"),
  como: z.string().describe("Cómo hacerlo, dos o tres frases prácticas"),
  tiempo: z.string().describe("Tiempo aproximado, por ejemplo '15 minutos' o '1 tarde'"),
});

const Color = z.object({
  nombre: z.string(),
  hex: z.string().describe("Color en formato #RRGGBB"),
});

const Validity = {
  es_valida: z
    .boolean()
    .describe("false si la imagen no muestra un espacio comercial que se pueda revisar (o una web en el caso de coherencia)"),
  motivo_no_valida: z.string().describe("Si es_valida es false, el motivo en una frase. Si no, cadena vacía."),
};

export const RevisionSchema = z.object({
  ...Validity,
  titulo: z.string().describe("Título corto del informe, máximo 6 palabras"),
  resumen: z.string().describe("Diagnóstico en dos o tres frases, en tono de experto cercano"),
  lo_que_funciona: z.array(z.string()).describe("Dos o tres aciertos reales que hay que mantener"),
  prioridades: z.array(Priority).describe("Exactamente 3, ordenadas de más a menos impacto"),
  criterios: z.object({
    punto_focal: Criterion,
    composicion: Criterion,
    color: Criterion,
    luz: Criterion,
    historia: Criterion,
    orden: Criterion,
    senaletica: Criterion,
    invitacion: Criterion,
  }),
  plan: z.object({
    dias_30: z.array(z.string()).describe("Lo que el cliente nota mañana: orden, limpieza, luz, cartel, entrada. Sin presupuesto. 3 a 5 acciones."),
    dias_60: z.array(z.string()).describe("Lo que cambia la manera de trabajar: rutinas, calendario, formación. 2 a 4 acciones."),
    dias_90: z.array(z.string()).describe("Lo que necesita inversión o decisión: iluminación, mobiliario, layout. 1 a 3 acciones."),
  }),
  guia_equipo: z.array(z.string()).describe("Checklist de 4 a 6 puntos para que cualquier persona del equipo mantenga el espacio cada día"),
  paleta_sugerida: z.array(Color).describe("Dos o tres colores que funcionarían con el producto que se ve"),
  cartel_sugerido: z.string().describe("Texto de cartel de máximo 6 palabras, o cadena vacía si no hace falta"),
});

export const CoherenciaSchema = z.object({
  ...Validity,
  titulo: z.string().describe("Título corto, máximo 6 palabras"),
  resumen: z.string().describe("¿Cuentan tienda y web la misma historia? Dos o tres frases."),
  lo_que_funciona: z.array(z.string()).describe("Dos o tres puntos en los que ya coinciden"),
  prioridades: z.array(Priority).describe("Exactamente 3"),
  criterios: z.object({
    identidad: Criterion,
    protagonista: Criterion,
    mensaje: Criterion,
    imagen: Criterion,
    recorrido: Criterion,
    llamada: Criterion,
  }),
  en_tienda: z.array(z.string()).describe("Cambios a hacer en la tienda, 2 a 4"),
  en_web: z.array(z.string()).describe("Cambios a hacer en la web, 2 a 4"),
});

export const IdeaSchema = z.object({
  titulo: z.string().describe("Nombre del concepto, máximo 5 palabras"),
  frase_brief: z.string().describe("El brief en una frase: qué vendemos, a quién y qué queremos que sienta"),
  historia: z.string().describe("La historia del escaparate en tres o cuatro frases"),
  paleta: z.array(Color.extend({ uso: z.string().describe("Dónde se usa: fondo, producto, acento...") })).describe("Dos o tres colores"),
  estructura: z.enum(["piramide", "repeticion", "asimetria"]),
  por_que_estructura: z.string(),
  punto_focal: z.string().describe("Qué pieza es la protagonista y dónde va"),
  montaje: z.array(z.string()).describe("Pasos de montaje en orden, 5 a 8"),
  atrezo: z
    .array(
      z.object({
        elemento: z.string(),
        coste: z.enum(["bajo", "medio", "alto"]),
        alternativa_reutilizada: z.string().describe("Cómo conseguirlo reutilizando o con comercio local"),
      }),
    )
    .describe("3 a 6 elementos"),
  cartel: z.string().describe("Texto del cartel, máximo 6 palabras"),
  luz: z.string(),
  medir: z.array(z.string()).describe("Cómo saber si funciona sin herramientas caras, 2 o 3 ideas"),
  errores_a_evitar: z.array(z.string()).describe("2 o 3 errores típicos con este concepto"),
  tiempo_montaje: z.string().describe("Tiempo aproximado de montaje"),
});

export type RevisionResult = z.infer<typeof RevisionSchema>;
export type CoherenciaResult = z.infer<typeof CoherenciaSchema>;
export type IdeaResult = z.infer<typeof IdeaSchema>;

// Entradas que envía la persona (validadas en la API).
export const SPACE_TYPES = ["escaparate", "mesa", "lineal", "probador", "fachada", "interior"] as const;
export const STORE_TYPES = ["moda", "calzado", "joyeria", "decoracion", "belleza", "gourmet", "otro"] as const;

export const ReviewInputSchema = z.object({
  kind: z.enum(["revision", "coherencia"]),
  space_type: z.enum(SPACE_TYPES),
  store_type: z.enum(STORE_TYPES).optional(),
  goal: z.string().trim().max(300).optional(),
});

export const IdeaInputSchema = z.object({
  store_type: z.enum(STORE_TYPES),
  campaign: z.string().trim().min(2).max(80),
  product: z.string().trim().min(2).max(160),
  style: z.string().trim().max(160).optional(),
  budget: z.enum(["bajo", "medio", "alto"]),
  window_size: z.enum(["pequeno", "mediano", "grande"]).optional(),
});

export type ReviewInput = z.infer<typeof ReviewInputSchema>;
export type IdeaInput = z.infer<typeof IdeaInputSchema>;
