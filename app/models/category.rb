class Category < ActiveRecord::Base

	has_many :children, :class_name => "Category", :foreign_key => "parent_id"
	belongs_to :parent, :class_name => "Category"
  	has_many :products

	def to_tree
	    {
	    	"id" => self.id,
	    	"category_page_url" => self.category_page_url,
			"category_id" => self.category_id,
			"image_url" => self.image_url,
			"name" => self.name,
			"parent_id_str" => self.parent_id_str,
			"parent_id" => self.parent_id,
		    "subCategory"  => self.children.map { |c| c.to_tree },
		    "products" =>self.products
	    }
  end

  def get_top_products_for_area(t_left, t_right, b_left, b_right)
    products = self.products
    avg_ratings = {}
    products.sort_by{|p|
      Review.get_avg_rating(p.get_reviews_by_location(t_left, t_right, b_left, b_right))
    }
    products
  end

  def get_reviews_by_area(t_left, t_right, b_left, b_right)
    products = self.products
    reviews = []
    products.map{|p|
      reviews << p.get_reviews_by_location(t_left, t_right, b_left, b_right)
    }
    reviews.flatten!
    reviews
  end

end
