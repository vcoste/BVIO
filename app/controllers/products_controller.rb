class ProductsController < ApplicationController

  def index
    category_id = params[:category_id].to_i if params[:category_id]
    corners = params[:corners]
    if corners.is_a? String
      corners = JSON.parse(corners)
    end
    t_left = corners['NW']
    t_right = corners['NE']
    b_left = corners['SW']
    b_right = corners['SE']
    all_categories = Category.all
    all_products = Product.all
    category = all_categories.select{|c| c.id == category_id}.first
    products = category.get_all_products(t_left, t_right, b_left, b_right, all_categories, all_products)

    render :json => products.to_json, :status => 200
  end

end