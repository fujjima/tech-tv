namespace :batch do
  # bundle exec rails batch:save_movie
  desc "動画の登録"
  task save_movie: :environment do
    YOUTUBE_LIVE_KEYWORD = "youtu.be"
    MOVIE_LINK_PATTERN = /https?:\/\/youtu.be\/\w+/

    events = Event.where('description like ? ', "%#{YOUTUBE_LIVE_KEYWORD}%").pluck(:id, :description)
    next if events.size == Movie.count

    events.each do |event|
      event_id = event[0]
      description = event[1]
      movie_link_ary = description.scan(MOVIE_LINK_PATTERN).uniq

      movie_link_ary.each_with_index do |movie_link, i|
        begin
          movie = Movie.find_or_create_by!(url: movie_link)
          EventMovie.find_or_create_by!(event_id: event_id, movie_id: movie.id)
          Event.find(event_id).update(thumbnail_url: movie.thumbnail_url)
        rescue => exception
          Rails.logger.error(exception.message)
          Raven.capture_exception(exception)
        end
      end
    end
  end
end