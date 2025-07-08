
  function updateValue(e, value) {
      var document = 'packages/com.walmart.android/errors/'
      document += e.target.value
      const docRef = firestore.doc(document);
      docRef.update({
          valid: value
      }).then(function() {
          console.log('Update value');
      }).catch(function(error) {
          console.log('Got an error: ', error);
      });
  }

  document.addEventListener('click', function(e) {
      if (e.target.id == 'agree') {
          updateValue(e, true);
      } else {
          updateValue(e, false);
      }
  });