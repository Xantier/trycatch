package com.hallila.trycatch.service

import org.funktionale.either.Either

object ResponseParsingService {

    fun parseResponse(response: List<Either<AssertionResult<*>, String>>): String =
        response.map { parseResponse(it) }.reduceRight { s, s2 -> "$s\n$s2" }

    fun parseResponse(response: Either<AssertionResult<*>, String>): String =
        when (response) {
            is Either.Left -> {
                val left = response.l
                "Failed! \nExpected ${left.expected} \nGot ${left.actual}"
            }
            is Either.Right -> {
                val right = response.r
                "Success, got response: \n$right"
            }
        }

    fun parseQueryResponse(response: Either<AssertionResult<QueryResult>, QueryResult>): Map<String, *> =
        when (response) {
            is Either.Left -> {
                val left = response.l
                mapOf(
                    "result" to "failure",
                    "expectation" to left.expected,
                    "actual" to left.actual
                )
            }
            is Either.Right -> {
                val right = response.r
                mapOf(
                    "result" to "success",
                    "actual" to right
                )
            }
        }
}

