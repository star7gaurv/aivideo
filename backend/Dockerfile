FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    curl \
    unzip \
    git \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Set working directory
WORKDIR /var/www/html/aivideo/backend

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

# If Laravel not installed, install it
RUN if [ ! -f artisan ]; then \
    composer create-project laravel/laravel . --prefer-dist; \
    fi

# Install dependencies if composer.json exists
RUN if [ -f composer.json ]; then composer install; fi

# Expose the PHP-FPM port
EXPOSE 9000

# Start the PHP-FPM server
CMD ["php-fpm"]
