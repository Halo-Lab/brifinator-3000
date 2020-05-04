<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	$username = $this->command->ask('Enter username');
    	$password = $this->command->ask("Enter {$username}'s password");
    	$email = $this->command->ask("Enter {$username}'s email");

    	DB::table('users')->insert([
    		'name' => $username,
    		'email' => $email,
    		'password' => Hash::make($password),
    	]);

    	$this->command->info('User ' . $username . ' created successfully.');
    }
}
