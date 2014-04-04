class CategoriesController < ApplicationController

  def index
    # TODO, remove this cache delete
    Rails.cache.delete("categories-index")
    @tree = Rails.cache.fetch("categories-index"){
    	all_cats = Category.all
    	top_cats = all_cats.where(:parent_id => nil)

    	tree = []
    	top_cats.each do |cat|
    		tree << cat.to_tree(all_cats)
    	end
      tree.sort_by{|c| c["name"]}
      tree
    }
    render :json => @tree.to_json
  end

end