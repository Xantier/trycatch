package com.hallila.trycatch.handler

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.github.kittinunf.fuel.core.Method
import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.model.JsonAssertionStep
import com.hallila.trycatch.model.JsonExpectation
import com.hallila.trycatch.model.Request
import com.hallila.trycatch.service.AssertionService
import com.hallila.trycatch.service.HttpClientService
import com.hallila.trycatch.service.ResponseParsingService
import io.netty.handler.codec.http.HttpResponseStatus
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson.json
import ratpack.jackson.Jackson.jsonNode
import ratpack.rx.RxRatpack
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class HttpRequestHandler @Inject constructor(val client: HttpClientService) : Handler, WithLogging() {
    override fun handle(ctx: Context) {
        ctx.parse(jsonNode()).map {
            LOG.debug("Client input JSON: {}", it)
            val method = method(it.get(JsonHelpers.METHOD).asText())
            parseHttpRequest(it, method)
        }.onError { e ->
            LOG.warn("Failed to parse JSON", e)
            ctx.response.status(HttpResponseStatus.UNPROCESSABLE_ENTITY.code()).send("Failed to Parse JSON: ${e.message}")
        }.then { req ->
            RxRatpack.promiseSingle(client.call(req.request, req.payload))
                .onError { e ->
                    LOG.warn("Failed to make request to external API", e)
                    ctx.response.status(HttpResponseStatus.FAILED_DEPENDENCY.code()).send("Failed to make request to external API: ${e.message}")
                }.then { x ->
                LOG.debug("API Responded with: {}", x)
                val result = AssertionService.assertEquals(req.expectation.value, x)
                ctx.render(json(ResponseParsingService.parseQueryResponse(result)))
            }
        }
    }

    private fun parseHttpRequest(it: JsonNode, method: Method): JsonAssertionStep {
        return if (method == Method.GET) {
            JsonAssertionStep("Individual Step", "{\"empty\":\"empty\"}", JsonExpectation(),
                Request(method, it.get(JsonHelpers.URL).asText(), toParamsMap(it.get(JsonHelpers.PARAMS) as ArrayNode)))
        } else {
            val valid = it.get(JsonHelpers.VALID_JSON)
            JsonAssertionStep("Individual Step", tryParseJson(valid, it, JsonHelpers.PAYLOAD), JsonExpectation(tryParseJson(valid, it, JsonHelpers.EXPECTED)),
                Request(method, it.get(JsonHelpers.URL).asText(), toParamsMap(it.get(JsonHelpers.PARAMS) as ArrayNode)))
        }
    }
}