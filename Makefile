# Produce PDFs from all Markdown files in a directory

# List files to be made by finding all *.markdown files and appending .pdf
PDFS := $(patsubst %.markdown,%.markdown.pdf,$(wildcard *.markdown))
DOCX := $(patsubst %.markdown,%.markdown.docx,$(wildcard *.markdown))
TEX := $(patsubst %.markdown,%.markdown.tex,$(wildcard *.markdown))

# The all rule makes all the PDF files listed
all : $(PDFS) $(DOCX) $(TEX)

# makes all markdown into PDFs
pdf : $(PDFS)

# makes all markdown into docx
docx : $(DOCX)

# makes all markdown into tex
tex : $(TEX)

# This generic rule accepts PDF targets with corresponding Markdown 
# source, and makes them using pandoc
%.markdown.pdf : %.markdown
	pandoc $< -o $@ -N --toc

# This generic rule accepts docx targets with corresponding Markdown 
# source, and makes them using pandoc
%.markdown.docx : %.markdown
	pandoc $< -o $@ -N --toc

# This generic rule accepts docx targets with corresponding Markdown 
# source, and makes them using pandoc
%.markdown.tex : %.markdown
	pandoc -s $< -o $@ -N --toc

# Remove all outputs
clean :
	rm $(PDFS) $(DOCX) $(TEX)

# Remove all PDF outputs then build them again
rebuild : clean all
