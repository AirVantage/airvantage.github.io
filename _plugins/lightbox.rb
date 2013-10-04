# A Liquid tag for Jekyll sites that allows embedding Lightbox images.
# by: kyoendo
# Source URL: https://gist.github.com/4035604
#
# Example usage: {% lightbox 2012/abc.png, Title of Image, Alt Title %}
module Jekyll
  class LightboxTag < Liquid::Tag
    def initialize(tag_name, text, token)
      super
      @text = text
    end
 
    def render(context)
      path, title, width, style = @text.split(',').map(&:strip)
      %{<a href="/resources/img/#{path}" data-lightbox="imageset" title="#{title}"><img style="#{style || ''}" width="#{width || 250}" src="/resources/img/#{path}" alt="#{title}" /></a>}
    end
  end
end
 
Liquid::Template.register_tag('lightbox', Jekyll::LightboxTag)