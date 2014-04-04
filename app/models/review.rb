class Review < ActiveRecord::Base

  belongs_to :author
  belongs_to :product

  # number of reviews, average rating, satisfaction

  def self.get_avg_rating(reviewArray)
  	ratingSum = reviewArray.map{ |r| r.rating }.inject(:+)
  	avg = reviewArray.length > 0 ? ratingSum.to_f/reviewArray.length : 0
  	return avg
  end

  def self.get_number_of_reviews(reviewArray)
  	return reviewArray.length
  end

  def self.get_satisfaction(reviewArray)
  	satisfactionSum = 0
  	reviewArray.each { |r| satisfactionSum += 1 if r.is_recommended }
  	satisfaction = reviewArray.length > 0 ? (satisfactionSum/reviewArray.length) * 100.00 : 0.00 #return a percentage
  	return satisfaction
  end

  def self.get_helpfulness(reviewArray)
  	helpfulnessSum = 0
  	totalHelpfulness = 0
  	reviewArray.each { |r| 
  	  if r.nil?
  			# do not count (should be NULL)
	   else
	  	totalHelpfulness ++
	  	helpfulnessSum += r.helpfulness
	  end
  	}
  	helpfulness = totalHelpfulness > 0 ? (helpfulnessSum/totalHelpfulness) * 100.00 : 0.00 #return a percentage
  	return helpfulness
  end

  def self.tag_count(reviewArray)
    tag_hash = Hash.new
    tag_array = Array.new
    tag_hash.default = 0
    total_value = 0
    
    reviewArray.each { |r|
      tag_string = r.tags 
      if !tag_string.nil?
        product_tags = JSON.parse(tag_string)
        product_tags.each { |tag| 
          tag_hash[tag] += 1
          total_value += 1
        }
      end
    }

    tag_hash.each { |key,value|
      tag_array << {key => (value/total_value) * 100}
    }
    tag_array.sort_by!{ |t|
      t.values.first
    }.reverse!

    return tag_array
  end

  def get_gender_percent(reviews)
    num_reviews = reviews.length
    author_ids = reviews.map{|r| r.author_id}
    all_authors = Author.all.select{|x| author_ids.include? id}
    total_female = all_authors.select{|a| a.gender.downcase == "female"}.length
    total_male = all_authors.select{|a| a.gender.downcase == "male"}.length
    {"Female" => (total_female / num_reviews) * 100, "Male" => (total_male/num_reviews) * 100}
  end

  def get_top_review(reviews)
    review = reviews.sort_by{|r| r.helpfulness}.reverse.first
    review
  end

  def is_recommended(reviews)
    num_reviews = reviews.length
    recommended_reviews = reviews.select{|r| r.is_recommended}.length
    recommended_reviews > num_reviews/2
  end

end
