# frozen_string_literal: true

def enable_test_coverage
  require "simplecov"
  SimpleCov.start do
    add_filter "/test/"
    add_group "Models", "app/models"
    add_group "Mailers", "app/mailers"
    add_group "Controllers", "app/controllers"
    add_group "Uploaders", "app/uploaders"
    add_group "Helpers", "app/helpers"
    add_group "Jobs", "app/jobs"
    add_group "Services", "app/services"
  end
end

enable_test_coverage if ENV["COVERAGE"]

def headers(user, options = {})
  {
    Accept: "application/json",
    "Content_Type" => "application/json",
    "X-Auth-Token" => user.authentication_token,
    "X-Auth-Email" => user.email
  }.merge(options)
end

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
# Previous content of test helper as is

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    include FactoryBot::Syntax::Methods
    parallelize(workers: :number_of_processors) unless ENV["COVERAGE"]

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    # fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end
