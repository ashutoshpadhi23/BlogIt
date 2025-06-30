# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  constraints(lambda { |req| req.format == :json }) do
    resources :posts, only: %i[index create show update destroy], param: :slug do
      member do
        post :vote
      end
      # collection do
      resource :report, only: %i[create], module: :posts do
        get :download, on: :collection
      end
      # end
    end
    resources :users, only: %i[index create show]
    resources :categories, only: %i[index create show], param: :name
    resources :organizations, only: %i[index create show]
    resource :session, only: [:create, :destroy]
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
