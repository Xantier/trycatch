package com.hallila.trycatch.handler

import com.hallila.trycatch.service.HttpClientService
import com.hallila.trycatch.service.QueryResult
import org.funktionale.either.Either
import org.json.JSONObject
import org.skyscreamer.jsonassert.JSONAssert
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.http.client.HttpClient
import ratpack.jackson.Jackson.jsonNode
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class HttpRequestHandler @Inject constructor(val client: HttpClientService) : Handler {
    override fun handle(ctx: Context) {
        ctx.parse(jsonNode()).map {
            JSONObject(it.get("json").asText())
        }.onError { e ->
            ctx.response.status(422).send("Failed to Parse JSON: " + e.message)
        }.flatMap { json ->
            client.get(ctx.get(HttpClient::class.java), "http://jsonplaceholder.typicode.com/posts/1").map { appResponse ->
                try {
                    JSONAssert.assertEquals(JSONObject(appResponse.body), json, true)
                    Either.Right<AssertionResult, QueryResult>(appResponse)
                } catch (e: Error) {
                    Either.Left<AssertionResult, QueryResult>(AssertionResult(json.toString(), appResponse.body))
                }
            }
        }.then {
            when (it) {
                is Either.Left<*, *> -> {
                    val left = it.l as AssertionResult
                    ctx.response.send("Failed! \nExpected " + left.expected + "\nGot " + left.actual)
                }
                is Either.Right<*, *> -> {
                    val right = it.r as QueryResult
                    ctx.response.send("Success, got response: \n" + right.body)
                }
            }
        }
    }
}

data class AssertionResult(val expected: String, val actual: String)