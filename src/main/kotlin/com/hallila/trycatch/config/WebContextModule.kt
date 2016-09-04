package com.hallila.trycatch.config

import com.google.inject.AbstractModule
import com.google.inject.multibindings.Multibinder
import com.hallila.trycatch.boundary.Repository
import com.hallila.trycatch.boundary.RepositoryImpl
import com.hallila.trycatch.boundary.RetrofitService
import com.hallila.trycatch.handler.DatabaseInsertHandler
import com.hallila.trycatch.handler.DatabaseSelectHandler
import com.hallila.trycatch.handler.HttpRequestHandler
import com.hallila.trycatch.handler.LoggingHandler
import com.hallila.trycatch.service.DatabaseService
import com.hallila.trycatch.service.DatabaseServiceImpl
import com.hallila.trycatch.service.HttpClientService
import com.hallila.trycatch.service.HttpClientServiceImpl
import ratpack.handling.HandlerDecorator
import ratpack.rx.RxRatpack

class WebContextModule : AbstractModule() {

    override fun configure() {
        RxRatpack.initialize()
        bind(Repository::class.java).to(RepositoryImpl::class.java)
        bind(DatabaseService::class.java).to(DatabaseServiceImpl::class.java)
        bind(HttpClientService::class.java).to(HttpClientServiceImpl::class.java)
        bind(HttpRequestHandler::class.java)
        bind(DatabaseInsertHandler::class.java)
        bind(DatabaseSelectHandler::class.java)
        bind(RetrofitService::class.java).toInstance(RetrofitContext.build().create(RetrofitService::class.java))
        Multibinder.newSetBinder(binder(), HandlerDecorator::class.java)
            .addBinding()
            .toInstance(ratpack.handling.HandlerDecorator.prepend(LoggingHandler()))
    }
}
