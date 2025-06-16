# frozen_string_literal: true

class AddForeignKeyToPost < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :user_id, :integer
    add_foreign_key :posts, :users, column: :user_id
  end
end
