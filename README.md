<p align="center">
	<a href="https://www.halo-lab.com/?utm_source=github-brifinator-3000">
  		<img src="http://api.halo-lab.com/wp-content/uploads/dev_halo.svg" alt="Developed in Halo lab" height="60">
	</a>
</p>

<p align="center"><img src="https://res.cloudinary.com/dtfbvvkyp/image/upload/v1566331377/laravel-logolockup-cmyk-red.svg" width="400"></p>

## Server Requirements

- PHP >= 7.2.5
- BCMath PHP Extension
- Ctype PHP Extension
- Fileinfo PHP extension
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PDO PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension

## Installation steps

Clone project
```
git clone https://github.com/Halo-Lab/brifinator-3000.git
```

Install packages
```
composer install
```

Copy .env.example to .env
```
cp .env.example .env
```

Generate App Key
```
php artisan key:generate
```

Start table migration
```
php artisan migrate —seed
```
After migration, the application will ask you for your username, password and email.
