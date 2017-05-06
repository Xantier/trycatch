package com.hallila.trycatch.service

import com.google.inject.Inject
import com.google.inject.Singleton
import com.hallila.trycatch.model.*
import org.funktionale.either.Either
import rx.Observable
import rx.lang.kotlin.onError
import rx.lang.kotlin.toObservable

@Singleton class ScenarioRunner @Inject constructor(
    val databaseService: DatabaseService,
    val httpClientService: HttpClientService
) {
    fun handleScenarios(scenarios: List<Scenario>): Unit =
        report(scenarios.toObservable().flatMap {
            handleScenario(it)
        })

    // TODO: Create a better reported
    // TODO: Modify error cases to use some static error object.
    fun handleScenario(scenario: Scenario): Observable<Result> =
        scenario.steps.toObservable().flatMap { step ->
            when (step) {
                is InsertStep        -> databaseService.insert(step.statement)
                    .zipWith(Observable.just(step), { result, expected ->
                        Assertable<DatabaseResponseExpectation, String>(step.name, expected.expectation, result)
                    }).onError {
                    Observable.just(Assertable(step.name, DatabaseResponseExpectation(""), "failure"))
                }
                is SelectStep        -> databaseService.select(step.statement)
                    .toList()
                    .zipWith(Observable.just(step), { result, expected ->
                        Assertable<CsvExpectation, List<String>>(step.name, expected.expectation, result)
                    }).onError {
                    Observable.just(Assertable(step.name, CsvExpectation(emptyList()), emptyList()))
                }
                is JsonAssertionStep -> httpClientService.call(step.request, step.payload)
                    .zipWith(Observable.just(step), { result, expected ->
                        Assertable(step.name, expected.expectation, Json(result.response.body().string()))
                    }).onError {
                    Observable.just(Assertable(step.name, JsonExpectation("{}"), Json("{}")))
                }
                else                 -> throw RuntimeException("Failed to determine type of step in Scenario")
            }
        }.map { assertable ->
            val either = AssertionService.assertEquals(assertable)
            Result(assertable.identifier, either)
        }
}

data class Assertable<out T : Expectation<U>, out U>(val identifier: String, val expectation: T, val result: U)
data class Result(val identifier: String, val result: Either<AssertionResult<*>, *>)
