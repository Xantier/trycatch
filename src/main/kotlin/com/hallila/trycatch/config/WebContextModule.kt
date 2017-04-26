package com.hallila.trycatch.config

import com.google.inject.AbstractModule
import com.google.inject.multibindings.Multibinder
import com.hallila.trycatch.boundary.HttpClient
import com.hallila.trycatch.boundary.Repository
import com.hallila.trycatch.boundary.RepositoryImpl
import com.hallila.trycatch.handler.*
import com.hallila.trycatch.service.*
import ratpack.handling.HandlerDecorator
import ratpack.rx.RxRatpack

class WebContextModule : AbstractModule() {

    override fun configure() {
        RxRatpack.initialize()
        bind(Repository::class.java).to(RepositoryImpl::class.java)
        bind(DatabaseService::class.java).to(DatabaseServiceImpl::class.java)
        bind(HttpClientService::class.java).to(HttpClientServiceImpl::class.java)
        bind(HttpRequestHandler::class.java)
        bind(ScenarioSaveHandler::class.java)
        bind(ScenarioRunHandler::class.java)
        bind(ScenarioLoadHandler::class.java)
        bind(ScenarioRunner::class.java)
        bind(DatabaseInsertHandler::class.java)
        bind(DatabaseSelectHandler::class.java)
        bind(HttpClient::class.java)
        Multibinder.newSetBinder(binder(), HandlerDecorator::class.java)
            .addBinding()
            .toInstance(ratpack.handling.HandlerDecorator.prepend(LoggingHandler()))
    }
}
