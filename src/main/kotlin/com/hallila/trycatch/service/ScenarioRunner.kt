package com.hallila.trycatch.service

import com.google.inject.Inject
import com.google.inject.Singleton
import com.hallila.trycatch.model.*
import rx.Observable
import rx.lang.kotlin.toObservable

@Singleton class ScenarioRunner @Inject constructor(
    val databaseService: DatabaseService,
    val httpClientService: HttpClientService
) {
    fun handleScenario(scenario: Scenario): String {
        scenario.steps.toObservable().flatMap { step ->
            when (step) {
                is InsertStep -> databaseService.insert(step.statement).zipWith(Observable.just(step), { a, b ->
                    Result(b.expectation, a)
                })
                is SelectStep -> databaseService.select(step.statement).zipWith(Observable.just(step), { a, b ->
                    Result(b.expectation, a)
                })
                is JsonAssertionStep -> httpClientService.call(step.request, step.payload).zipWith(Observable.just(step), { a, b ->
                    Result<Expectation<Json>, Json>(b.expectation, Json(a.body))
                })
                else -> Observable.just(Result(DatabaseResponseExpectation("1"), "1"))
            }
        }.map { result ->
            AssertionService.assertEquals(result)
        }.subscribe {
            if (it.isRight()) println(it.right()) else println(it.left())
        }
        return ""
    }
}

data class Result<out T : Expectation<U>, out U>(val expectation: T, val result: U)
