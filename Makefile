bower:
	cd public; ../node_modules/bower/bin/bower install
libsbmlsim:
	npm install cmake
	wget http://fun.bio.keio.ac.jp/software/libsbmlsim/downloads/libsbmlsim-1.1.0.tar.gz
	tar -xvzf libsbmlsim-1.1.0.tar.gz
	mkdir -p libsbmlsim-1.1.0/build
	cd libsbmlsim-1.1.0/build; export PATH=../../node_modules/cmake/bin:$(PATH); cmake .. -DCMAKE_INSTALL_PREFIX=../../libsbmlsim -DLIBSBML_INCLUDE_DIR=../../node_modules/libsbml/include -DLIBSBML_LIBRARY=../../node_modules/libsbml/lib64/libsbml.so
	cd libsbmlsim-1.1.0/build; export PATH=../../node_modules/cmake/bin:$(PATH); make -j4
	cd libsbmlsim-1.1.0/build; make install
	rm -rf libsbmlsim-1.1.0
	rm *.tar.gz
clean:
	rm -rf libsbmlsim-1.1.0
	rm *.tar.gz