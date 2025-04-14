# Use the official PHP image with required extensions for Laravel
FROM php:8.1-fpm

# Install system dependencies and PHP extensions required by Laravel
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd pdo pdo_mysql

# Set the working directory to the backend folder
WORKDIR /var/www/html/aivideo/backend

# Copy the existing Laravel project files into the container
COPY . .

# Install Composer (Laravel's dependency manager)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Laravel dependencies using Composer
RUN composer install --no-dev --optimize-autoloader

# Expose the port that Laravel will run on (default is 9000 for PHP-FPM)
EXPOSE 9000

# Set the entrypoint to start PHP-FPM
CMD ["php-fpm"]
