# Use the official PHP 8.2 image with FPM (FastCGI Process Manager) for Nginx
FROM php:8.2-fpm

# Set the working directory
WORKDIR /var/www/html/aivideo/backend

# Install system dependencies required for Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libxml2-dev \
    zip \
    git \
    curl \
    nginx \
    libssl-dev \
    libmcrypt-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql xml

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install the PHP dependencies with Composer (without dev dependencies)
COPY . .
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions for Laravel storage and cache directories
RUN chown -R www-data:www-data /var/www/html/aivideo/backend/storage /var/www/html/aivideo/backend/bootstrap/cache
RUN chmod -R 775 /var/www/html/aivideo/backend/storage /var/www/html/aivideo/backend/bootstrap/cache

# Expose port 9000 for PHP-FPM (or another port as needed)
EXPOSE 9000

# Run migrations (this can be adjusted if needed for different environments)
#RUN php artisan migrate --force
RUN npm install && npm run dev
# Optimize Laravel application (including config, routes, and autoload)
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# Start PHP-FPM and Nginx
CMD service nginx start && php-fpm
