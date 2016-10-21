package com.hallila.trycatch.service

import com.hallila.trycatch.model.*
import org.funktionale.either.Either
import org.json.JSONObject
import org.skyscreamer.jsonassert.JSONAssert

object AssertionService {
    fun assertEquals(expected: List<String>, actual: List<String>): Either<AssertionResult, List<String>> =
        if (expected == actual) {
            Either.Right<AssertionResult, List<String>>(actual)
        } else {
            val exp = expected.fold("", { a, b -> "$a,$b" })
            val act = actual.fold("", { a, b -> "$a,$b" })
            Either.Left<AssertionResult, List<String>>(AssertionResult(exp, act))
        }

    fun assertEquals(expected: String, actual: String): Either<AssertionResult, String> =
        if (expected == actual) {
            Either.Right<AssertionResult, String>(actual)
        } else {
            Either.Left<AssertionResult, String>(AssertionResult(expected, actual))
        }

    fun assertEquals(expected: Json, actual: QueryResult): Either<AssertionResult, QueryResult> =
        try {
            JSONAssert.assertEquals(JSONObject(actual.body), JSONObject(expected), true)
            Either.Right<AssertionResult, QueryResult>(actual)
        } catch (e: Error) {
            Either.Left<AssertionResult, QueryResult>(AssertionResult(expected.toString(), actual.body))
        }

    private fun assertEquals(expected: Json, result: Json): Either<AssertionResult, Json> =
        try {
            JSONAssert.assertEquals(result.content, expected.content, true)
            Either.Right<AssertionResult, Json>(result)
        } catch (e: Error) {
            Either.Left<AssertionResult, Json>(AssertionResult(expected.toString(), result.toString()))
        }

    @Suppress("UNCHECKED_CAST")
    fun <U> assertEquals(assertable: Assertable<Expectation<U>, U>): Either<AssertionResult, *> =
        when (assertable.expectation) {
            is DatabaseResponseExpectation -> {
                val expected: String = assertable.expectation.value
                val actual: String = assertable.result as String
                assertEquals(expected, actual)
            }
            is CsvExpectation -> {
                val expected: List<String> = assertable.expectation.value
                val actual: List<String> = assertable.result as List<String>
                assertEquals(expected, actual)
            }
            is JsonExpectation -> {
                val expected: Json = assertable.expectation.value
                val result: Json = assertable.result as Json
                assertEquals(expected, result)
            }
            else -> {
                throw RuntimeException("Unable to determine expectation type :(")
            }
        }
}

data class AssertionResult(val expected: String, val actual: String)
