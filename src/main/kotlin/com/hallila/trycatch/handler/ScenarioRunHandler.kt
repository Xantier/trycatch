package com.hallila.trycatch.handler

import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.model.Scenario
import com.hallila.trycatch.service.ScenarioRunner
import io.netty.handler.codec.http.HttpResponseStatus
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class ScenarioRunHandler @Inject constructor(val scenarioRunner: ScenarioRunner) : Handler, WithLogging() {
    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode()).map {
            it.get("json")
        }.map {
            Scenario.buildFromJson(it)
        }.onError { e ->
            LOG.warn("Failed to construct Scenario", e)
            ctx.response.status(HttpResponseStatus.UNPROCESSABLE_ENTITY.code()).send("Failed to construct Scenario: ${e.message}")
        }.then {
            println(it)
            //report(scenarioRunner.handleScenario(it), { ctx.response.send() })
            ctx.response.send("Done")
        }
    }
}