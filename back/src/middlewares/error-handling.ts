import { AppError } from "@/utils/AppError"
import { ErrorRequestHandler } from "express"
import { ZodError } from "zod"

export const errorHandling: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message })
    return
  }

  if (error instanceof ZodError) {
    console.log("Erros de validação:", error.format()) //detalha melhor os erros
    response.status(400).json({
      message: "validation error",
      issues: error.format(),
    })
    return
  }

  response.status(500).json({ message: error.message })
  return
}
