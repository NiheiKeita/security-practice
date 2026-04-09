FROM php:8.3-fpm

ENV TZ Asia/Tokyo

RUN apt-get update && \
	apt-get install -y git unzip libzip-dev libicu-dev libonig-dev && \
	docker-php-ext-install intl pdo_mysql zip bcmath
		
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
	RUN apt-get install -y nodejs
	RUN npm install npm@latest -g

COPY ./php.ini /usr/local/etc/php/php.ini

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /app

