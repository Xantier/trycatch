package com.hallila.trycatch.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.google.inject.Inject
import com.google.inject.Singleton
import com.hallila.trycatch.model.*
import org.funktionale.either.Either
import rx.Observable
import rx.lang.kotlin.toObservable

@Singleton class ScenarioRunner @Inject constructor(
    val databaseService: DatabaseService,
    val httpClientService: HttpClientService
) {
    fun handleScenarios(scenarios: List<Scenario>): Unit =
        report(scenarios.toObservable().concatMap {
            handleScenario(it)
        })

    fun handleScenario(scenario: Scenario): Observable<Result> =
        scenario.steps.toObservable().concatMap { step ->
            when (step) {
                is InsertStep -> databaseService.insert(step.statement)
                    .zipWith(Observable.just(step), { result, expected ->
                        Assertable<DatabaseResponseExpectation, String>(step.name, expected.expectation, result)
                    }).onErrorResumeNext { e ->
                    Observable.just(Assertable(step.name, step.expectation, ObjectMapper().writeValueAsString(mapOf(
                        "result" to "failure",
                        "message" to "Failed to run DB insert statement: ${e.message}"
                    )), false))
                }
                is SelectStep -> databaseService.select(step.statement)
                    .toList()
                    .zipWith(Observable.just(step), { result, expected ->
                        Assertable<CsvExpectation, List<String>>(step.name, expected.expectation, result)
                    }).onErrorResumeNext { e ->
                    Observable.just(Assertable(step.name, step.expectation, listOf(ObjectMapper().writeValueAsString(mapOf(
                        "result" to "failure",
                        "message" to "Failed to make request to the database: ${e.message}"
                    ))), false))
                }
                is JsonAssertionStep -> httpClientService.call(step.request, step.payload)
                    .zipWith(Observable.just(step), { result, expected ->
                        Assertable(step.name, expected.expectation, Json(result.response.body().string()))
                    }).onErrorResumeNext { e ->
                    Observable.just(Assertable(step.name, step.expectation,
                        Json(ObjectMapper().writeValueAsString(mapOf(
                            "result" to "failure",
                            "message" to "Failed to make request to external API: ${e.message}"))
                        ), false))
                }
                else -> throw RuntimeException("Failed to determine type of step in Scenario")
            }
        }.map { assertable ->
            val either = AssertionService.assertEquals(assertable)
            Result(assertable.identifier, either)
        }
}

data class Assertable<out T : Expectation<U>, out U>(val identifier: String, val expectation: T, val result: U, val isSuccess: Boolean = true)
data class Result(val identifier: String, val result: Either<AssertionResult<*>, *>)
