package com.hallila.trycatch.service

import com.hallila.trycatch.model.*
import org.funktionale.either.Either
import org.json.JSONException
import org.json.JSONObject
import org.skyscreamer.jsonassert.JSONAssert
import org.skyscreamer.jsonassert.JSONCompareMode

object AssertionService {
    val FAILED_QUERY_RESULT = "Failed to parse JSON response from API"

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

    fun assertEquals(expected: Json, actual: QueryResult): Either<AssertionResult<FailureResult<*>>, QueryResult> =
        try {
            JSONAssert.assertEquals(JSONObject(expected.content), JSONObject(actual.response.body().string()), JSONCompareMode.LENIENT)
            Either.Right<AssertionResult<FailureResult<*>>, QueryResult>(actual)
        } catch(e: Throwable) {
            when (e) {
                is AssertionError -> left(actual, expected)
                is JSONException  -> left(failedJsonParseResponse(actual.response.body().string(), actual.responseCode), expected)
                else              -> left(failedJsonParseResponse(actual.response.body().string(), actual.responseCode), expected)
            }
        }

    private fun failedJsonParseResponse(body: String, responseCode: Int, msg: String = FAILED_QUERY_RESULT) = mapOf("response" to body, "errormessage" to msg, "responseCode" to responseCode)
    private fun <T> left(actual: T, expected: Json) = Either.Left<AssertionResult<FailureResult<T>>, QueryResult>(AssertionResult(expected.toString(), FailureResult(actual)))

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

data class FailureResult<out T>(val actual: T)
data class AssertionResult<out T>(val expected: String, val actual: T)
