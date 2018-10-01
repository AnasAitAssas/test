# Symfony-API
Required: Git, Composer, PHP

1. Clone the code from GitHub:

    # git clone https://github.com/gibsonneke/symfony-api.git

2. Run Composer:

    # composer install

3. Set up the database

    # php bin/console doctrine:database:create
	# php bin/console doctrine:schema:update --force
	
4. Use the faker bundle to seed the database with dummy data

	# php bin/console faker:populate
	
5. Run the built-in web server

	# php bin/console server:run
	
6. Access the API documentation in your favourite browser

	# http://127.0.0.1:8000/doc