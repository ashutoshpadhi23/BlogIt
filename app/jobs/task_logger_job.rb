# frozen_string_literal: true

class TaskLoggerJob
  include Sidekiq::Job

  def perform
    puts "TaskLoggerJob is performed"
  end
end
