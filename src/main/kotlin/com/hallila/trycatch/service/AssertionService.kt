package com.hallila.trycatch.service

import com.hallila.trycatch.model.*
import org.funktionale.either.Either
import org.json.JSONException
import org.json.JSONObject
import org.skyscreamer.jsonassert.JSONAssert
import org.skyscreamer.jsonassert.JSONCompareMode

object AssertionService {
    fun assertEquals(expected: List<String>, actual: List<String>): Either<AssertionResult<String>, List<String>> =
        if (expected == actual) {
            Either.Right<AssertionResult<String>, List<String>>(actual)
        } else {
            val exp = expected.fold("", { a, b -> "$a,$b" })
            val act = actual.fold("", { a, b -> "$a,$b" })
            Either.Left<AssertionResult<String>, List<String>>(AssertionResult(exp, act))
        }

    fun assertEquals(expected: String, actual: String): Either<AssertionResult<String>, String> =
        if (expected == actual) {
            Either.Right<AssertionResult<String>, String>(actual)
        } else {
            Either.Left<AssertionResult<String>, String>(AssertionResult(expected, actual))
        }

    fun assertEquals(expected: Json, actual: QueryResult): Either<AssertionResult<QueryResult>, QueryResult> =
        try {
            JSONAssert.assertEquals(JSONObject(expected.content), JSONObject(actual.body), JSONCompareMode.LENIENT)
            Either.Right<AssertionResult<QueryResult>, QueryResult>(actual)
        } catch(e: Throwable) {
            when (e) {
                is AssertionError -> Either.Left<AssertionResult<QueryResult>, QueryResult>(AssertionResult(expected.toString(), actual))
                is JSONException  -> Either.Left<AssertionResult<QueryResult>, QueryResult>(AssertionResult(expected.toString(), QueryResult("Failed to parse JSON response from API", -1)))
                else              -> Either.Left<AssertionResult<QueryResult>, QueryResult>(AssertionResult(expected.toString(), QueryResult("Failed to parse JSON response from API", -1)))
            }
        }

    private fun assertEquals(expected: Json, result: Json): Either<AssertionResult<Json>, Json> =
        try {
            JSONAssert.assertEquals(expected.content, result.content, JSONCompareMode.LENIENT)
            Either.Right<AssertionResult<Json>, Json>(result)
        } catch (e: Error) {
            Either.Left<AssertionResult<Json>, Json>(AssertionResult(expected.toString(), result))
        }

    @Suppress("UNCHECKED_CAST")
    fun <U> assertEquals(assertable: Assertable<Expectation<U>, U>): Either<AssertionResult<*>, *> =
        when (assertable.expectation) {
            is DatabaseResponseExpectation -> {
                val expected: String = assertable.expectation.value
                val actual: String = assertable.result as String
                assertEquals(expected, actual)
            }
            is CsvExpectation              -> {
                val expected: List<String> = assertable.expectation.value
                val actual: List<String> = assertable.result as List<String>
                assertEquals(expected, actual)
            }
            is JsonExpectation             -> {
                val expected: Json = assertable.expectation.value
                val result: Json = assertable.result as Json
                assertEquals(expected, result)
            }
            else                           -> {
                throw RuntimeException("Unable to determine expectation type :(")
            }
        }
}

data class AssertionResult<T>(val expected: String, val actual: T)
