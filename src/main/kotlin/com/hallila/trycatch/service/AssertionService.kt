package com.hallila.trycatch.service

import com.hallila.trycatch.model.*
import org.funktionale.either.Either
import org.json.JSONObject
import org.skyscreamer.jsonassert.JSONAssert

object AssertionService {
    fun <T> assertEquals(expected: List<String>, actual: T): Either<AssertionResult, T> =
        assertEquals(expected.reduce { s, s2 -> "$s,$s2" }, actual)

    fun <T> assertEquals(expected: String, actual: T): Either<AssertionResult, T> =
        if (expected.equals(actual)) {
            Either.Right<AssertionResult, T>(actual)
        } else {
            Either.Left<AssertionResult, T>(AssertionResult(expected, actual as String))
        }

    fun assertEquals(appResponse: QueryResult, json: JSONObject): Either<AssertionResult, QueryResult> =
        try {
            JSONAssert.assertEquals(JSONObject(appResponse.body), json, true)
            Either.Right<AssertionResult, QueryResult>(appResponse)
        } catch (e: Error) {
            Either.Left<AssertionResult, QueryResult>(AssertionResult(json.toString(), appResponse.body))
        }

    private fun <U> assertEquals(expected: Json, result: U): Either<AssertionResult, U> =
        try {
            result as Json
            JSONAssert.assertEquals(result.content, expected.content, true)
            Either.Right<AssertionResult, U>(result)
        } catch (e: Error) {
            Either.Left<AssertionResult, U>(AssertionResult(expected.toString(), result.toString()))
        }

    fun <U> assertEquals(result: Result<Expectation<U>, U>): Either<AssertionResult, U> =

        when (result.expectation) {
            is DatabaseResponseExpectation -> assertEquals(result.expectation.getValue(), result.result)
            is CsvExpectation -> assertEquals(result.expectation.getValue(), result.result)
            is JsonExpectation -> assertEquals(result.expectation.getValue(), result.result)
            else -> {
                throw RuntimeException("whoops")
            }
        }
}

data class AssertionResult(val expected: String, val actual: String)
