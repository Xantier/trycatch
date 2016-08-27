package com.hallila.trycatch.handler

import com.hallila.trycatch.repository.TestRepository
import org.funktionale.either.Either
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class DatabaseSelectHandler @Inject constructor(val repository: TestRepository) : Handler {
    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode()).map {
            it.get("json")
        }.flatMap { json ->
            val expected = json.get("expected").asText()
            println(expected)
            repository.select(json.get("query").asText()).map { queryResult ->
                println(queryResult)
                queryResult.reduce({ s1, s2 -> "$s1|$s2" })
            }.map { piped ->
                if (expected.equals(piped)) {
                    Either.Right<AssertionResult, String>(piped)
                } else {
                    Either.Left<AssertionResult, String>(AssertionResult(expected.toString(), piped))
                }
            }
        }.then {
            when (it) {
                is Either.Left<*, *> -> {
                    val left = it.l as AssertionResult
                    ctx.response.send("Failed! \nExpected " + left.expected + "\nGot " + left.actual)
                }
                is Either.Right<*, *> -> {
                    val right = it.r as String
                    ctx.response.send("Success, got response: \n" + right)
                }
            }
        }
    }
}