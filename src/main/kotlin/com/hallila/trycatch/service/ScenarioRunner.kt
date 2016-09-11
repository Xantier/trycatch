package com.hallila.trycatch.service

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
        report(scenarios.toObservable().flatMap {
            handleScenario(it)
        })

    fun handleScenario(scenario: Scenario): Observable<Result> =
        scenario.steps.toObservable().flatMap { step ->
            when (step) {
                is InsertStep -> databaseService.insert(step.statement)
                    .zipWith(Observable.just(step), { a, b ->
                        Assertable<DatabaseResponseExpectation, String>(step.name, b.expectation, a)
                    })
                is SelectStep -> databaseService.select(step.statement)
                    .toList()
                    .zipWith(Observable.just(step), { a, b ->
                        Assertable<CsvExpectation, List<String>>(step.name, b.expectation, a)
                    })
                is JsonAssertionStep -> httpClientService.call(step.request, step.payload)
                    .zipWith(Observable.just(step), { a, b ->
                        Assertable(step.name, b.expectation, Json(a.body))
                    }).onErrorResumeNext {
                    // TODO: Create exception type for the monad that we can ignore
                    Observable.just(Assertable(step.name, JsonExpectation("{}"), Json("{}")))
                }
                else -> throw RuntimeException("Failed to determine type of step in Scenario")
            }
        }.map { assertable ->
            val either = AssertionService.assertEquals(assertable)
            Result(assertable.identifier, either)
        }
}

private fun report(results: Observable<Result>) {
    results.map { result ->
        val wasSuccessful = if (result.result.isRight()) "successful" else "failure"
        val expectationResponse = if (result.result.isRight()) {
            "Expected to get '${result.result.right().get().toString()}' and got that!"
        } else
            "Expected to get '${result.result.left().get().expected}' but instead got '${result.result.left().get().actual}' :((("
        println("Step result for step ${result.identifier} was $wasSuccessful. $expectationResponse")
    }.subscribe({}, {
        println("Failed to process this step because of this: ${it.message}")
    })
}

data class Assertable<out T : Expectation<U>, out U>(val identifier: String, val expectation: T, val result: U)
data class Result(val identifier: String, val result: Either<AssertionResult, *>)
