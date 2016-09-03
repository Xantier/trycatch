package com.hallila.trycatch.service

import org.funktionale.either.Either
import org.json.JSONObject
import org.skyscreamer.jsonassert.JSONAssert

object AssertionService {
    fun assertEquals(expected: String, actual: String): Either<AssertionResult, String> {
        if (expected.equals(actual)) {
            return Either.Right<AssertionResult, String>(actual)
        } else {
            return Either.Left<AssertionResult, String>(AssertionResult(expected, actual))
        }
    }

    fun assertEquals(appResponse: QueryResult, json: JSONObject): Either<AssertionResult, QueryResult> =
        try {
            JSONAssert.assertEquals(JSONObject(appResponse.body), json, true)
            Either.Right<AssertionResult, QueryResult>(appResponse)
        } catch (e: Error) {
            Either.Left<AssertionResult, QueryResult>(AssertionResult(json.toString(), appResponse.body))
        }
}

data class AssertionResult(val expected: String, val actual: String)
