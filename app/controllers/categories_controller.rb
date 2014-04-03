class CategoriesController < ApplicationController

  def index
  	allCat = Category.
  	topCat = allCat.where(:parent_id => nil)

  	@tree = []
  	topCat.each do |cat|
  		@tree << cat.to_tree
  	end

	render :json => @tree.to_json
  end

end